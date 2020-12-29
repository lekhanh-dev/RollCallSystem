package com.rollcallsystem.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private List<String> roles;

	@SuppressWarnings("unchecked")
	public JwtResponse(String accessToken, String username, Collection<? extends GrantedAuthority> roles) {
        this.token = accessToken;
        this.username = username;
        
        List<String> roleList = new ArrayList<String>();
        Iterator<GrantedAuthority> list;
        list = (Iterator<GrantedAuthority>) roles.iterator();
        while(list.hasNext()) {
        	roleList.add(list.next().getAuthority());
        }
        
        this.roles = roleList;
    }
	
	public JwtResponse(String accessToken, String username, List<Role> roles) {
        this.token = accessToken;
        this.username = username;
        
        List<String> roleList = new ArrayList<String>();
        for (Role role : roles) {
			roleList.add(role.getName());
		}
        this.roles = roleList;
    }
 
    public String getAccessToken() {
        return token;
    }

    public void setAccessToken(String accessToken) {
        this.token = accessToken;
    }

    public String getTokenType() {
        return type;
    }

    public void setTokenType(String tokenType) {
        this.type = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
}
