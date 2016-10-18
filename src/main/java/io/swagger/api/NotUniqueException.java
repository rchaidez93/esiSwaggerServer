package io.swagger.api;

public class NotUniqueException extends ApiException {
	private int code;
	public NotUniqueException (int code, String msg) {
		super(code, msg);
		this.code = code;
	}
}
