package com.anchormind.odaat.repository.search;

import com.anchormind.odaat.domain.JobLocation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the JobLocation entity.
 */
public interface JobLocationSearchRepository extends ElasticsearchRepository<JobLocation, Long> {
}
