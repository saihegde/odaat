package com.anchormind.odaat.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Job.
 */
@Entity
@Table(name = "job")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "job")
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "job_date")
    private Instant jobDate;

    @Column(name = "pay", precision = 10, scale = 2)
    private BigDecimal pay;

    @OneToOne
    @JoinColumn(unique = true)
    private JobLocation location;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User owner;

    @OneToMany(mappedBy = "job")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<JobBid> jobBids = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Job title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Job description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getJobDate() {
        return jobDate;
    }

    public Job jobDate(Instant jobDate) {
        this.jobDate = jobDate;
        return this;
    }

    public void setJobDate(Instant jobDate) {
        this.jobDate = jobDate;
    }

    public BigDecimal getPay() {
        return pay;
    }

    public Job pay(BigDecimal pay) {
        this.pay = pay;
        return this;
    }

    public void setPay(BigDecimal pay) {
        this.pay = pay;
    }

    public JobLocation getLocation() {
        return location;
    }

    public Job location(JobLocation jobLocation) {
        this.location = jobLocation;
        return this;
    }

    public void setLocation(JobLocation jobLocation) {
        this.location = jobLocation;
    }

    public User getOwner() {
        return owner;
    }

    public Job owner(User user) {
        this.owner = user;
        return this;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public Set<JobBid> getJobBids() {
        return jobBids;
    }

    public Job jobBids(Set<JobBid> jobBids) {
        this.jobBids = jobBids;
        return this;
    }

    public Job addJobBid(JobBid jobBid) {
        this.jobBids.add(jobBid);
        jobBid.setJob(this);
        return this;
    }

    public Job removeJobBid(JobBid jobBid) {
        this.jobBids.remove(jobBid);
        jobBid.setJob(null);
        return this;
    }

    public void setJobBids(Set<JobBid> jobBids) {
        this.jobBids = jobBids;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Job job = (Job) o;
        if (job.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), job.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Job{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", jobDate='" + getJobDate() + "'" +
            ", pay=" + getPay() +
            "}";
    }
}
