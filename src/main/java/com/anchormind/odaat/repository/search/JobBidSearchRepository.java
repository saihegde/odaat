package com.anchormind.odaat.repository.search;

import com.anchormind.odaat.domain.JobBid;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the JobBid entity.
 */
public interface JobBidSearchRepository extends ElasticsearchRepository<JobBid, Long> {
}
