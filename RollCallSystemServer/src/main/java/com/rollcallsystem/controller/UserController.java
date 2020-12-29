package com.rollcallsystem.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rollcallsystem.model.JwtResponse;
import com.rollcallsystem.model.MessageResponse;
import com.rollcallsystem.model.Role;
import com.rollcallsystem.model.TokenRequest;
import com.rollcallsystem.model.User;
import com.rollcallsystem.model.request.UserDTO;
import com.rollcallsystem.repository.UserRepository;
import com.rollcallsystem.service.RoleService;
import com.rollcallsystem.service.UserService;
import com.rollcallsystem.service.impl.JwtService;

@RestController
@CrossOrigin("*")
public class UserController {

//    private static final String DEFAULT_ROLE = "ROLE_STUDENT";

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> showAllUser() {
//    	Iterable<User> users = userService.findAll();
//        for(int i = 0; i < users.size(); i++) {
//        	users.get(i).setPassword("******");
//        }
    	User users = userRepository.findByUsername("admin");
    	
        
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping("/register")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
    	User user = new User();
    	user.setUsername(userDTO.getUsername());
    	user.setPassword(userDTO.getPassword());
        Iterable<User> users = userService.findAll();
        for (User currentUser : users) {
            if (currentUser.getUsername().equals(user.getUsername())) {
                return new ResponseEntity<>( new MessageResponse("Username already exists", true), HttpStatus.BAD_REQUEST);
            }
        }
        Role role = roleService.findRoleByName(userDTO.getRole());
        if(role == null) {
        	return new ResponseEntity<>(new MessageResponse("Role not exist", false), HttpStatus.BAD_REQUEST);
        } else {
        	List<Role> roles = new ArrayList<>();
            roles.add(role);
            user.setRoles(roles);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userService.save(user);
            return new ResponseEntity<>(new MessageResponse("Username registered successfully!", false), HttpStatus.CREATED);
        }
        
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
    	try {
    		Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtService.generateTokenLogin(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return new ResponseEntity<>(new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities()), HttpStatus.OK);
//            return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities()));
		} catch (Exception e) {
			return new ResponseEntity<>(new MessageResponse("Tài khoản hoặc mật khẩu không chính xác", true), HttpStatus.BAD_REQUEST);
		}
    }
    
    @PostMapping("/valid-token")
    public ResponseEntity<?> validToken(@RequestBody TokenRequest tokenObj) {
    	String token = tokenObj.getToken();
    	boolean check = jwtService.validateJwtToken(token);
    	if(check) {
    		String username = jwtService.getUserNameFromJwtToken(token);
    		User user = userService.findByUsername(username);
    		return ResponseEntity.ok(new JwtResponse(token, user.getUsername(), user.getRoles()));
    		
    	} else {
    		return new ResponseEntity<>(new MessageResponse("Error token", true), HttpStatus.BAD_REQUEST);
    	}
    } 
    	
    public void createUserDemo(User user, String Role) {
    	Iterable<User> users = userService.findAll();
        for (User currentUser : users) {
            if (currentUser.getUsername().equals(user.getUsername())) {
            	System.out.println("Username already exists");
            	return ;
            } 
        }
        Role role = roleService.findRoleByName(Role);
        List<Role> roles = new ArrayList<>();
        roles.add(role);
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.save(user);
    }
    
	@GetMapping("/public/demo-data")
	public ResponseEntity<?> createDemoData() {
//		Create role
		Role role = new Role();
		role.setName("ROLE_ADMIN");
		roleService.save(role);
		Role role1 = new Role();
		role1.setName("ROLE_TEACHER");
		roleService.save(role1);
		Role role2 = new Role();
		role2.setName("ROLE_STUDENT");
		roleService.save(role2);
		
// 		Create user
		User user = new User();
		user.setUsername("admin");
		user.setPassword("admin");
		createUserDemo(user, "ROLE_ADMIN");
		
		User user1 = new User();
		user1.setUsername("teacher");
		user1.setPassword("teacher");
		createUserDemo(user1, "ROLE_TEACHER");
		
		User user2 = new User();
		user2.setUsername("student");
		user2.setPassword("student");
		createUserDemo(user2, "ROLE_STUDENT");
		
		return new ResponseEntity<>("Tạo dữ liệu demo thành công", HttpStatus.OK);
	}
}
