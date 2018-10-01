package com.anchormind.odaat.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "userprofile")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receive_email_alerts")
    private Boolean receiveEmailAlerts;

    @Column(name = "receive_text_alerts")
    private Boolean receiveTextAlerts;

    @Column(name = "notify_of_jobs_in_area")
    private Boolean notifyOfJobsInArea;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isReceiveEmailAlerts() {
        return receiveEmailAlerts;
    }

    public UserProfile receiveEmailAlerts(Boolean receiveEmailAlerts) {
        this.receiveEmailAlerts = receiveEmailAlerts;
        return this;
    }

    public void setReceiveEmailAlerts(Boolean receiveEmailAlerts) {
        this.receiveEmailAlerts = receiveEmailAlerts;
    }

    public Boolean isReceiveTextAlerts() {
        return receiveTextAlerts;
    }

    public UserProfile receiveTextAlerts(Boolean receiveTextAlerts) {
        this.receiveTextAlerts = receiveTextAlerts;
        return this;
    }

    public void setReceiveTextAlerts(Boolean receiveTextAlerts) {
        this.receiveTextAlerts = receiveTextAlerts;
    }

    public Boolean isNotifyOfJobsInArea() {
        return notifyOfJobsInArea;
    }

    public UserProfile notifyOfJobsInArea(Boolean notifyOfJobsInArea) {
        this.notifyOfJobsInArea = notifyOfJobsInArea;
        return this;
    }

    public void setNotifyOfJobsInArea(Boolean notifyOfJobsInArea) {
        this.notifyOfJobsInArea = notifyOfJobsInArea;
    }

    public User getUser() {
        return user;
    }

    public UserProfile user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        UserProfile userProfile = (UserProfile) o;
        if (userProfile.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userProfile.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", receiveEmailAlerts='" + isReceiveEmailAlerts() + "'" +
            ", receiveTextAlerts='" + isReceiveTextAlerts() + "'" +
            ", notifyOfJobsInArea='" + isNotifyOfJobsInArea() + "'" +
            "}";
    }
}
