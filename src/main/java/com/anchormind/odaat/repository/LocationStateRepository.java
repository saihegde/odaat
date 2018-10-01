package com.anchormind.odaat.repository;

import com.anchormind.odaat.domain.LocationState;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the LocationState entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LocationStateRepository extends JpaRepository<LocationState, Long> {

}
