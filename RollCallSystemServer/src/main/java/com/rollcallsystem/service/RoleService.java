package com.rollcallsystem.service;

import com.rollcallsystem.model.Role;

public interface RoleService {
    Role findRoleByName(String roleName);
    void save(Role role);
}
