package com.rollcallsystem.model;

public class MessageResponse {
	private String message;
	private boolean error;

	public MessageResponse(String message, boolean error) {
	    this.message = message;
	    this.error = error;
	}
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public boolean getError() {
		return error;
	}

	public void setError(boolean error) {
		this.error = error;
	}
}