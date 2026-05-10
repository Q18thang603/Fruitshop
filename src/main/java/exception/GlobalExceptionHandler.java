package exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// lỗi chung
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception ex) {

		Map<String, Object> error = new HashMap<>();
		error.put("message", ex.getMessage());
		error.put("status", 500);

		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	// lỗi không tìm thấy
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntime(RuntimeException ex) {

		Map<String, Object> error = new HashMap<>();
		error.put("message", ex.getMessage());
		error.put("status", 400);

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
}