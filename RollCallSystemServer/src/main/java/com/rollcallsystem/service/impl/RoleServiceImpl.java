package com.rollcallsystem.service.impl;

import com.rollcallsystem.model.Role;
import com.rollcallsystem.repository.RoleRepository;
import com.rollcallsystem.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role findRoleByName(String roleName) {
        return roleRepository.findRoleByName(roleName);
    }

	@Override
	public void save(Role role) {
		roleRepository.save(role);
	}
}
