package com.anchormind.odaat.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of JobLocationSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class JobLocationSearchRepositoryMockConfiguration {

    @MockBean
    private JobLocationSearchRepository mockJobLocationSearchRepository;

}
