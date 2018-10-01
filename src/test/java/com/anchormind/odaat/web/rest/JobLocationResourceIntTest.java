package com.anchormind.odaat.web.rest;

import com.anchormind.odaat.OdaatApp;

import com.anchormind.odaat.domain.JobLocation;
import com.anchormind.odaat.repository.JobLocationRepository;
import com.anchormind.odaat.repository.search.JobLocationSearchRepository;
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
 * Test class for the JobLocationResource REST controller.
 *
 * @see JobLocationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = OdaatApp.class)
public class JobLocationResourceIntTest {

    private static final String DEFAULT_ADDRESS_LINE_1 = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS_LINE_1 = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS_LINE_2 = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS_LINE_2 = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_ZIPCODE = "AAAAAAAAAA";
    private static final String UPDATED_ZIPCODE = "BBBBBBBBBB";

    @Autowired
    private JobLocationRepository jobLocationRepository;

    /**
     * This repository is mocked in the com.anchormind.odaat.repository.search test package.
     *
     * @see com.anchormind.odaat.repository.search.JobLocationSearchRepositoryMockConfiguration
     */
    @Autowired
    private JobLocationSearchRepository mockJobLocationSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restJobLocationMockMvc;

    private JobLocation jobLocation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final JobLocationResource jobLocationResource = new JobLocationResource(jobLocationRepository, mockJobLocationSearchRepository);
        this.restJobLocationMockMvc = MockMvcBuilders.standaloneSetup(jobLocationResource)
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
    public static JobLocation createEntity(EntityManager em) {
        JobLocation jobLocation = new JobLocation()
            .addressLine1(DEFAULT_ADDRESS_LINE_1)
            .addressLine2(DEFAULT_ADDRESS_LINE_2)
            .city(DEFAULT_CITY)
            .zipcode(DEFAULT_ZIPCODE);
        return jobLocation;
    }

    @Before
    public void initTest() {
        jobLocation = createEntity(em);
    }

    @Test
    @Transactional
    public void createJobLocation() throws Exception {
        int databaseSizeBeforeCreate = jobLocationRepository.findAll().size();

        // Create the JobLocation
        restJobLocationMockMvc.perform(post("/api/job-locations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(jobLocation)))
            .andExpect(status().isCreated());

        // Validate the JobLocation in the database
        List<JobLocation> jobLocationList = jobLocationRepository.findAll();
        assertThat(jobLocationList).hasSize(databaseSizeBeforeCreate + 1);
        JobLocation testJobLocation = jobLocationList.get(jobLocationList.size() - 1);
        assertThat(testJobLocation.getAddressLine1()).isEqualTo(DEFAULT_ADDRESS_LINE_1);
        assertThat(testJobLocation.getAddressLine2()).isEqualTo(DEFAULT_ADDRESS_LINE_2);
        assertThat(testJobLocation.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testJobLocation.getZipcode()).isEqualTo(DEFAULT_ZIPCODE);

        // Validate the JobLocation in Elasticsearch
        verify(mockJobLocationSearchRepository, times(1)).save(testJobLocation);
    }

    @Test
    @Transactional
    public void createJobLocationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = jobLocationRepository.findAll().size();

        // Create the JobLocation with an existing ID
        jobLocation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobLocationMockMvc.perform(post("/api/job-locations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(jobLocation)))
            .andExpect(status().isBadRequest());

        // Validate the JobLocation in the database
        List<JobLocation> jobLocationList = jobLocationRepository.findAll();
        assertThat(jobLocationList).hasSize(databaseSizeBeforeCreate);

        // Validate the JobLocation in Elasticsearch
        verify(mockJobLocationSearchRepository, times(0)).save(jobLocation);
    }

    @Test
    @Transactional
    public void getAllJobLocations() throws Exception {
        // Initialize the database
        jobLocationRepository.saveAndFlush(jobLocation);

        // Get all the jobLocationList
        restJobLocationMockMvc.perform(get("/api/job-locations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobLocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].addressLine1").value(hasItem(DEFAULT_ADDRESS_LINE_1.toString())))
            .andExpect(jsonPath("$.[*].addressLine2").value(hasItem(DEFAULT_ADDRESS_LINE_2.toString())))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())))
            .andExpect(jsonPath("$.[*].zipcode").value(hasItem(DEFAULT_ZIPCODE.toString())));
    }
    
    @Test
    @Transactional
    public void getJobLocation() throws Exception {
        // Initialize the database
        jobLocationRepository.saveAndFlush(jobLocation);

        // Get the jobLocation
        restJobLocationMockMvc.perform(get("/api/job-locations/{id}", jobLocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(jobLocation.getId().intValue()))
            .andExpect(jsonPath("$.addressLine1").value(DEFAULT_ADDRESS_LINE_1.toString()))
            .andExpect(jsonPath("$.addressLine2").value(DEFAULT_ADDRESS_LINE_2.toString()))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY.toString()))
            .andExpect(jsonPath("$.zipcode").value(DEFAULT_ZIPCODE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingJobLocation() throws Exception {
        // Get the jobLocation
        restJobLocationMockMvc.perform(get("/api/job-locations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateJobLocation() throws Exception {
        // Initialize the database
        jobLocationRepository.saveAndFlush(jobLocation);

        int databaseSizeBeforeUpdate = jobLocationRepository.findAll().size();

        // Update the jobLocation
        JobLocation updatedJobLocation = jobLocationRepository.findById(jobLocation.getId()).get();
        // Disconnect from session so that the updates on updatedJobLocation are not directly saved in db
        em.detach(updatedJobLocation);
        updatedJobLocation
            .addressLine1(UPDATED_ADDRESS_LINE_1)
            .addressLine2(UPDATED_ADDRESS_LINE_2)
            .city(UPDATED_CITY)
            .zipcode(UPDATED_ZIPCODE);

        restJobLocationMockMvc.perform(put("/api/job-locations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedJobLocation)))
            .andExpect(status().isOk());

        // Validate the JobLocation in the database
        List<JobLocation> jobLocationList = jobLocationRepository.findAll();
        assertThat(jobLocationList).hasSize(databaseSizeBeforeUpdate);
        JobLocation testJobLocation = jobLocationList.get(jobLocationList.size() - 1);
        assertThat(testJobLocation.getAddressLine1()).isEqualTo(UPDATED_ADDRESS_LINE_1);
        assertThat(testJobLocation.getAddressLine2()).isEqualTo(UPDATED_ADDRESS_LINE_2);
        assertThat(testJobLocation.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testJobLocation.getZipcode()).isEqualTo(UPDATED_ZIPCODE);

        // Validate the JobLocation in Elasticsearch
        verify(mockJobLocationSearchRepository, times(1)).save(testJobLocation);
    }

    @Test
    @Transactional
    public void updateNonExistingJobLocation() throws Exception {
        int databaseSizeBeforeUpdate = jobLocationRepository.findAll().size();

        // Create the JobLocation

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobLocationMockMvc.perform(put("/api/job-locations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(jobLocation)))
            .andExpect(status().isBadRequest());

        // Validate the JobLocation in the database
        List<JobLocation> jobLocationList = jobLocationRepository.findAll();
        assertThat(jobLocationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the JobLocation in Elasticsearch
        verify(mockJobLocationSearchRepository, times(0)).save(jobLocation);
    }

    @Test
    @Transactional
    public void deleteJobLocation() throws Exception {
        // Initialize the database
        jobLocationRepository.saveAndFlush(jobLocation);

        int databaseSizeBeforeDelete = jobLocationRepository.findAll().size();

        // Get the jobLocation
        restJobLocationMockMvc.perform(delete("/api/job-locations/{id}", jobLocation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<JobLocation> jobLocationList = jobLocationRepository.findAll();
        assertThat(jobLocationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the JobLocation in Elasticsearch
        verify(mockJobLocationSearchRepository, times(1)).deleteById(jobLocation.getId());
    }

    @Test
    @Transactional
    public void searchJobLocation() throws Exception {
        // Initialize the database
        jobLocationRepository.saveAndFlush(jobLocation);
        when(mockJobLocationSearchRepository.search(queryStringQuery("id:" + jobLocation.getId())))
            .thenReturn(Collections.singletonList(jobLocation));
        // Search the jobLocation
        restJobLocationMockMvc.perform(get("/api/_search/job-locations?query=id:" + jobLocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobLocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].addressLine1").value(hasItem(DEFAULT_ADDRESS_LINE_1.toString())))
            .andExpect(jsonPath("$.[*].addressLine2").value(hasItem(DEFAULT_ADDRESS_LINE_2.toString())))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())))
            .andExpect(jsonPath("$.[*].zipcode").value(hasItem(DEFAULT_ZIPCODE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobLocation.class);
        JobLocation jobLocation1 = new JobLocation();
        jobLocation1.setId(1L);
        JobLocation jobLocation2 = new JobLocation();
        jobLocation2.setId(jobLocation1.getId());
        assertThat(jobLocation1).isEqualTo(jobLocation2);
        jobLocation2.setId(2L);
        assertThat(jobLocation1).isNotEqualTo(jobLocation2);
        jobLocation1.setId(null);
        assertThat(jobLocation1).isNotEqualTo(jobLocation2);
    }
}
