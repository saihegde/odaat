package com.anchormind.odaat.web.rest;

import com.anchormind.odaat.OdaatApp;

import com.anchormind.odaat.domain.LocationState;
import com.anchormind.odaat.repository.LocationStateRepository;
import com.anchormind.odaat.repository.search.LocationStateSearchRepository;
import com.anchormind.odaat.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static com.anchormind.odaat.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LocationStateResource REST controller.
 *
 * @see LocationStateResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = OdaatApp.class)
public class LocationStateResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private LocationStateRepository locationStateRepository;

    /**
     * This repository is mocked in the com.anchormind.odaat.repository.search test package.
     *
     * @see com.anchormind.odaat.repository.search.LocationStateSearchRepositoryMockConfiguration
     */
    @Autowired
    private LocationStateSearchRepository mockLocationStateSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLocationStateMockMvc;

    private LocationState locationState;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LocationStateResource locationStateResource = new LocationStateResource(locationStateRepository, mockLocationStateSearchRepository);
        this.restLocationStateMockMvc = MockMvcBuilders.standaloneSetup(locationStateResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LocationState createEntity(EntityManager em) {
        LocationState locationState = new LocationState()
            .name(DEFAULT_NAME);
        return locationState;
    }

    @Before
    public void initTest() {
        locationState = createEntity(em);
    }

    @Test
    @Transactional
    public void createLocationState() throws Exception {
        int databaseSizeBeforeCreate = locationStateRepository.findAll().size();

        // Create the LocationState
        restLocationStateMockMvc.perform(post("/api/location-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(locationState)))
            .andExpect(status().isCreated());

        // Validate the LocationState in the database
        List<LocationState> locationStateList = locationStateRepository.findAll();
        assertThat(locationStateList).hasSize(databaseSizeBeforeCreate + 1);
        LocationState testLocationState = locationStateList.get(locationStateList.size() - 1);
        assertThat(testLocationState.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the LocationState in Elasticsearch
        verify(mockLocationStateSearchRepository, times(1)).save(testLocationState);
    }

    @Test
    @Transactional
    public void createLocationStateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = locationStateRepository.findAll().size();

        // Create the LocationState with an existing ID
        locationState.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLocationStateMockMvc.perform(post("/api/location-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(locationState)))
            .andExpect(status().isBadRequest());

        // Validate the LocationState in the database
        List<LocationState> locationStateList = locationStateRepository.findAll();
        assertThat(locationStateList).hasSize(databaseSizeBeforeCreate);

        // Validate the LocationState in Elasticsearch
        verify(mockLocationStateSearchRepository, times(0)).save(locationState);
    }

    @Test
    @Transactional
    public void getAllLocationStates() throws Exception {
        // Initialize the database
        locationStateRepository.saveAndFlush(locationState);

        // Get all the locationStateList
        restLocationStateMockMvc.perform(get("/api/location-states?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(locationState.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getLocationState() throws Exception {
        // Initialize the database
        locationStateRepository.saveAndFlush(locationState);

        // Get the locationState
        restLocationStateMockMvc.perform(get("/api/location-states/{id}", locationState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(locationState.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLocationState() throws Exception {
        // Get the locationState
        restLocationStateMockMvc.perform(get("/api/location-states/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLocationState() throws Exception {
        // Initialize the database
        locationStateRepository.saveAndFlush(locationState);

        int databaseSizeBeforeUpdate = locationStateRepository.findAll().size();

        // Update the locationState
        LocationState updatedLocationState = locationStateRepository.findById(locationState.getId()).get();
        // Disconnect from session so that the updates on updatedLocationState are not directly saved in db
        em.detach(updatedLocationState);
        updatedLocationState
            .name(UPDATED_NAME);

        restLocationStateMockMvc.perform(put("/api/location-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLocationState)))
            .andExpect(status().isOk());

        // Validate the LocationState in the database
        List<LocationState> locationStateList = locationStateRepository.findAll();
        assertThat(locationStateList).hasSize(databaseSizeBeforeUpdate);
        LocationState testLocationState = locationStateList.get(locationStateList.size() - 1);
        assertThat(testLocationState.getName()).isEqualTo(UPDATED_NAME);

        // Validate the LocationState in Elasticsearch
        verify(mockLocationStateSearchRepository, times(1)).save(testLocationState);
    }

    @Test
    @Transactional
    public void updateNonExistingLocationState() throws Exception {
        int databaseSizeBeforeUpdate = locationStateRepository.findAll().size();

        // Create the LocationState

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocationStateMockMvc.perform(put("/api/location-states")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(locationState)))
            .andExpect(status().isBadRequest());

        // Validate the LocationState in the database
        List<LocationState> locationStateList = locationStateRepository.findAll();
        assertThat(locationStateList).hasSize(databaseSizeBeforeUpdate);

        // Validate the LocationState in Elasticsearch
        verify(mockLocationStateSearchRepository, times(0)).save(locationState);
    }

    @Test
    @Transactional
    public void deleteLocationState() throws Exception {
        // Initialize the database
        locationStateRepository.saveAndFlush(locationState);

        int databaseSizeBeforeDelete = locationStateRepository.findAll().size();

        // Get the locationState
        restLocationStateMockMvc.perform(delete("/api/location-states/{id}", locationState.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<LocationState> locationStateList = locationStateRepository.findAll();
        assertThat(locationStateList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the LocationState in Elasticsearch
        verify(mockLocationStateSearchRepository, times(1)).deleteById(locationState.getId());
    }

    @Test
    @Transactional
    public void searchLocationState() throws Exception {
        // Initialize the database
        locationStateRepository.saveAndFlush(locationState);
        when(mockLocationStateSearchRepository.search(queryStringQuery("id:" + locationState.getId())))
            .thenReturn(Collections.singletonList(locationState));
        // Search the locationState
        restLocationStateMockMvc.perform(get("/api/_search/location-states?query=id:" + locationState.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(locationState.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LocationState.class);
        LocationState locationState1 = new LocationState();
        locationState1.setId(1L);
        LocationState locationState2 = new LocationState();
        locationState2.setId(locationState1.getId());
        assertThat(locationState1).isEqualTo(locationState2);
        locationState2.setId(2L);
        assertThat(locationState1).isNotEqualTo(locationState2);
        locationState1.setId(null);
        assertThat(locationState1).isNotEqualTo(locationState2);
    }
}
