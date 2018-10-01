package com.anchormind.odaat.web.rest;

import com.anchormind.odaat.OdaatApp;

import com.anchormind.odaat.domain.JobBid;
import com.anchormind.odaat.repository.JobBidRepository;
import com.anchormind.odaat.repository.search.JobBidSearchRepository;
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

import com.anchormind.odaat.domain.enumeration.JobStatus;
/**
 * Test class for the JobBidResource REST controller.
 *
 * @see JobBidResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = OdaatApp.class)
public class JobBidResourceIntTest {

    private static final JobStatus DEFAULT_STATUS = JobStatus.OPEN;
    private static final JobStatus UPDATED_STATUS = JobStatus.IN_PROGRESS;

    @Autowired
    private JobBidRepository jobBidRepository;

    /**
     * This repository is mocked in the com.anchormind.odaat.repository.search test package.
     *
     * @see com.anchormind.odaat.repository.search.JobBidSearchRepositoryMockConfiguration
     */
    @Autowired
    private JobBidSearchRepository mockJobBidSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restJobBidMockMvc;

    private JobBid jobBid;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final JobBidResource jobBidResource = new JobBidResource(jobBidRepository, mockJobBidSearchRepository);
        this.restJobBidMockMvc = MockMvcBuilders.standaloneSetup(jobBidResource)
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
    public static JobBid createEntity(EntityManager em) {
        JobBid jobBid = new JobBid()
            .status(DEFAULT_STATUS);
        return jobBid;
    }

    @Before
    public void initTest() {
        jobBid = createEntity(em);
    }

    @Test
    @Transactional
    public void createJobBid() throws Exception {
        int databaseSizeBeforeCreate = jobBidRepository.findAll().size();

        // Create the JobBid
        restJobBidMockMvc.perform(post("/api/job-bids")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(jobBid)))
            .andExpect(status().isCreated());

        // Validate the JobBid in the database
        List<JobBid> jobBidList = jobBidRepository.findAll();
        assertThat(jobBidList).hasSize(databaseSizeBeforeCreate + 1);
        JobBid testJobBid = jobBidList.get(jobBidList.size() - 1);
        assertThat(testJobBid.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the JobBid in Elasticsearch
        verify(mockJobBidSearchRepository, times(1)).save(testJobBid);
    }

    @Test
    @Transactional
    public void createJobBidWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = jobBidRepository.findAll().size();

        // Create the JobBid with an existing ID
        jobBid.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobBidMockMvc.perform(post("/api/job-bids")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(jobBid)))
            .andExpect(status().isBadRequest());

        // Validate the JobBid in the database
        List<JobBid> jobBidList = jobBidRepository.findAll();
        assertThat(jobBidList).hasSize(databaseSizeBeforeCreate);

        // Validate the JobBid in Elasticsearch
        verify(mockJobBidSearchRepository, times(0)).save(jobBid);
    }

    @Test
    @Transactional
    public void getAllJobBids() throws Exception {
        // Initialize the database
        jobBidRepository.saveAndFlush(jobBid);

        // Get all the jobBidList
        restJobBidMockMvc.perform(get("/api/job-bids?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobBid.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getJobBid() throws Exception {
        // Initialize the database
        jobBidRepository.saveAndFlush(jobBid);

        // Get the jobBid
        restJobBidMockMvc.perform(get("/api/job-bids/{id}", jobBid.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(jobBid.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingJobBid() throws Exception {
        // Get the jobBid
        restJobBidMockMvc.perform(get("/api/job-bids/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateJobBid() throws Exception {
        // Initialize the database
        jobBidRepository.saveAndFlush(jobBid);

        int databaseSizeBeforeUpdate = jobBidRepository.findAll().size();

        // Update the jobBid
        JobBid updatedJobBid = jobBidRepository.findById(jobBid.getId()).get();
        // Disconnect from session so that the updates on updatedJobBid are not directly saved in db
        em.detach(updatedJobBid);
        updatedJobBid
            .status(UPDATED_STATUS);

        restJobBidMockMvc.perform(put("/api/job-bids")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedJobBid)))
            .andExpect(status().isOk());

        // Validate the JobBid in the database
        List<JobBid> jobBidList = jobBidRepository.findAll();
        assertThat(jobBidList).hasSize(databaseSizeBeforeUpdate);
        JobBid testJobBid = jobBidList.get(jobBidList.size() - 1);
        assertThat(testJobBid.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the JobBid in Elasticsearch
        verify(mockJobBidSearchRepository, times(1)).save(testJobBid);
    }

    @Test
    @Transactional
    public void updateNonExistingJobBid() throws Exception {
        int databaseSizeBeforeUpdate = jobBidRepository.findAll().size();

        // Create the JobBid

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobBidMockMvc.perform(put("/api/job-bids")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(jobBid)))
            .andExpect(status().isBadRequest());

        // Validate the JobBid in the database
        List<JobBid> jobBidList = jobBidRepository.findAll();
        assertThat(jobBidList).hasSize(databaseSizeBeforeUpdate);

        // Validate the JobBid in Elasticsearch
        verify(mockJobBidSearchRepository, times(0)).save(jobBid);
    }

    @Test
    @Transactional
    public void deleteJobBid() throws Exception {
        // Initialize the database
        jobBidRepository.saveAndFlush(jobBid);

        int databaseSizeBeforeDelete = jobBidRepository.findAll().size();

        // Get the jobBid
        restJobBidMockMvc.perform(delete("/api/job-bids/{id}", jobBid.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<JobBid> jobBidList = jobBidRepository.findAll();
        assertThat(jobBidList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the JobBid in Elasticsearch
        verify(mockJobBidSearchRepository, times(1)).deleteById(jobBid.getId());
    }

    @Test
    @Transactional
    public void searchJobBid() throws Exception {
        // Initialize the database
        jobBidRepository.saveAndFlush(jobBid);
        when(mockJobBidSearchRepository.search(queryStringQuery("id:" + jobBid.getId())))
            .thenReturn(Collections.singletonList(jobBid));
        // Search the jobBid
        restJobBidMockMvc.perform(get("/api/_search/job-bids?query=id:" + jobBid.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobBid.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobBid.class);
        JobBid jobBid1 = new JobBid();
        jobBid1.setId(1L);
        JobBid jobBid2 = new JobBid();
        jobBid2.setId(jobBid1.getId());
        assertThat(jobBid1).isEqualTo(jobBid2);
        jobBid2.setId(2L);
        assertThat(jobBid1).isNotEqualTo(jobBid2);
        jobBid1.setId(null);
        assertThat(jobBid1).isNotEqualTo(jobBid2);
    }
}
