package com.anchormind.odaat.repository;

import com.anchormind.odaat.domain.Job;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Job entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("select job from Job job where job.owner.login = ?#{principal.username}")
    List<Job> findByOwnerIsCurrentUser();

}
