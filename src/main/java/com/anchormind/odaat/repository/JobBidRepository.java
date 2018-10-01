package com.anchormind.odaat.repository;

import com.anchormind.odaat.domain.JobBid;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the JobBid entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobBidRepository extends JpaRepository<JobBid, Long> {

}
