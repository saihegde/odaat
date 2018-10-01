package com.anchormind.odaat.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.anchormind.odaat.domain.JobBid;
import com.anchormind.odaat.repository.JobBidRepository;
import com.anchormind.odaat.repository.search.JobBidSearchRepository;
import com.anchormind.odaat.web.rest.errors.BadRequestAlertException;
import com.anchormind.odaat.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing JobBid.
 */
@RestController
@RequestMapping("/api")
public class JobBidResource {

    private final Logger log = LoggerFactory.getLogger(JobBidResource.class);

    private static final String ENTITY_NAME = "jobBid";

    private final JobBidRepository jobBidRepository;

    private final JobBidSearchRepository jobBidSearchRepository;

    public JobBidResource(JobBidRepository jobBidRepository, JobBidSearchRepository jobBidSearchRepository) {
        this.jobBidRepository = jobBidRepository;
        this.jobBidSearchRepository = jobBidSearchRepository;
    }

    /**
     * POST  /job-bids : Create a new jobBid.
     *
     * @param jobBid the jobBid to create
     * @return the ResponseEntity with status 201 (Created) and with body the new jobBid, or with status 400 (Bad Request) if the jobBid has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/job-bids")
    @Timed
    public ResponseEntity<JobBid> createJobBid(@RequestBody JobBid jobBid) throws URISyntaxException {
        log.debug("REST request to save JobBid : {}", jobBid);
        if (jobBid.getId() != null) {
            throw new BadRequestAlertException("A new jobBid cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JobBid result = jobBidRepository.save(jobBid);
        jobBidSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/job-bids/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /job-bids : Updates an existing jobBid.
     *
     * @param jobBid the jobBid to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated jobBid,
     * or with status 400 (Bad Request) if the jobBid is not valid,
     * or with status 500 (Internal Server Error) if the jobBid couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/job-bids")
    @Timed
    public ResponseEntity<JobBid> updateJobBid(@RequestBody JobBid jobBid) throws URISyntaxException {
        log.debug("REST request to update JobBid : {}", jobBid);
        if (jobBid.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        JobBid result = jobBidRepository.save(jobBid);
        jobBidSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, jobBid.getId().toString()))
            .body(result);
    }

    /**
     * GET  /job-bids : get all the jobBids.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of jobBids in body
     */
    @GetMapping("/job-bids")
    @Timed
    public List<JobBid> getAllJobBids() {
        log.debug("REST request to get all JobBids");
        return jobBidRepository.findAll();
    }

    /**
     * GET  /job-bids/:id : get the "id" jobBid.
     *
     * @param id the id of the jobBid to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the jobBid, or with status 404 (Not Found)
     */
    @GetMapping("/job-bids/{id}")
    @Timed
    public ResponseEntity<JobBid> getJobBid(@PathVariable Long id) {
        log.debug("REST request to get JobBid : {}", id);
        Optional<JobBid> jobBid = jobBidRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jobBid);
    }

    /**
     * DELETE  /job-bids/:id : delete the "id" jobBid.
     *
     * @param id the id of the jobBid to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/job-bids/{id}")
    @Timed
    public ResponseEntity<Void> deleteJobBid(@PathVariable Long id) {
        log.debug("REST request to delete JobBid : {}", id);

        jobBidRepository.deleteById(id);
        jobBidSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/job-bids?query=:query : search for the jobBid corresponding
     * to the query.
     *
     * @param query the query of the jobBid search
     * @return the result of the search
     */
    @GetMapping("/_search/job-bids")
    @Timed
    public List<JobBid> searchJobBids(@RequestParam String query) {
        log.debug("REST request to search JobBids for query {}", query);
        return StreamSupport
            .stream(jobBidSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
