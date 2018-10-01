package com.anchormind.odaat.repository;

import com.anchormind.odaat.domain.JobLocation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the JobLocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobLocationRepository extends JpaRepository<JobLocation, Long> {

}
