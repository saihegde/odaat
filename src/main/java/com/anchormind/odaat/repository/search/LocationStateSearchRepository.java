package com.anchormind.odaat.repository.search;

import com.anchormind.odaat.domain.LocationState;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the LocationState entity.
 */
public interface LocationStateSearchRepository extends ElasticsearchRepository<LocationState, Long> {
}
