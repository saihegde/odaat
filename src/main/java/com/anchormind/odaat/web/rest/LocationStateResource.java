package com.anchormind.odaat.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.anchormind.odaat.domain.LocationState;
import com.anchormind.odaat.repository.LocationStateRepository;
import com.anchormind.odaat.repository.search.LocationStateSearchRepository;
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
 * REST controller for managing LocationState.
 */
@RestController
@RequestMapping("/api")
public class LocationStateResource {

    private final Logger log = LoggerFactory.getLogger(LocationStateResource.class);

    private static final String ENTITY_NAME = "locationState";

    private final LocationStateRepository locationStateRepository;

    private final LocationStateSearchRepository locationStateSearchRepository;

    public LocationStateResource(LocationStateRepository locationStateRepository, LocationStateSearchRepository locationStateSearchRepository) {
        this.locationStateRepository = locationStateRepository;
        this.locationStateSearchRepository = locationStateSearchRepository;
    }

    /**
     * POST  /location-states : Create a new locationState.
     *
     * @param locationState the locationState to create
     * @return the ResponseEntity with status 201 (Created) and with body the new locationState, or with status 400 (Bad Request) if the locationState has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/location-states")
    @Timed
    public ResponseEntity<LocationState> createLocationState(@RequestBody LocationState locationState) throws URISyntaxException {
        log.debug("REST request to save LocationState : {}", locationState);
        if (locationState.getId() != null) {
            throw new BadRequestAlertException("A new locationState cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LocationState result = locationStateRepository.save(locationState);
        locationStateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/location-states/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /location-states : Updates an existing locationState.
     *
     * @param locationState the locationState to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated locationState,
     * or with status 400 (Bad Request) if the locationState is not valid,
     * or with status 500 (Internal Server Error) if the locationState couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/location-states")
    @Timed
    public ResponseEntity<LocationState> updateLocationState(@RequestBody LocationState locationState) throws URISyntaxException {
        log.debug("REST request to update LocationState : {}", locationState);
        if (locationState.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        LocationState result = locationStateRepository.save(locationState);
        locationStateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, locationState.getId().toString()))
            .body(result);
    }

    /**
     * GET  /location-states : get all the locationStates.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of locationStates in body
     */
    @GetMapping("/location-states")
    @Timed
    public List<LocationState> getAllLocationStates() {
        log.debug("REST request to get all LocationStates");
        return locationStateRepository.findAll();
    }

    /**
     * GET  /location-states/:id : get the "id" locationState.
     *
     * @param id the id of the locationState to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the locationState, or with status 404 (Not Found)
     */
    @GetMapping("/location-states/{id}")
    @Timed
    public ResponseEntity<LocationState> getLocationState(@PathVariable Long id) {
        log.debug("REST request to get LocationState : {}", id);
        Optional<LocationState> locationState = locationStateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(locationState);
    }

    /**
     * DELETE  /location-states/:id : delete the "id" locationState.
     *
     * @param id the id of the locationState to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/location-states/{id}")
    @Timed
    public ResponseEntity<Void> deleteLocationState(@PathVariable Long id) {
        log.debug("REST request to delete LocationState : {}", id);

        locationStateRepository.deleteById(id);
        locationStateSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/location-states?query=:query : search for the locationState corresponding
     * to the query.
     *
     * @param query the query of the locationState search
     * @return the result of the search
     */
    @GetMapping("/_search/location-states")
    @Timed
    public List<LocationState> searchLocationStates(@RequestParam String query) {
        log.debug("REST request to search LocationStates for query {}", query);
        return StreamSupport
            .stream(locationStateSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
