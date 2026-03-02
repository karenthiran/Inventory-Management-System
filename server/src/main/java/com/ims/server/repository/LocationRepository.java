package com.ims.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.server.model.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, String> {

}
