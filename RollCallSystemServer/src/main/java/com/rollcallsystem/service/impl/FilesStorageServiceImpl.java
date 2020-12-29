package com.rollcallsystem.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import com.rollcallsystem.service.FilesStorageService;

@Service
public class FilesStorageServiceImpl implements FilesStorageService {

//  private final Path root = Paths.get("upload");

//  @Override
//  public void init() {
//    try {
//      Files.createDirectory(root);
//    } catch (IOException e) {
//      throw new RuntimeException("Không thể tạo thư mục upload");
//    }
//  }

	@Override
	public void saveStudentImage(byte[] bytes, String studentCode, String fileName) {
		Path root = Paths.get("upload/image/student/" + studentCode);

		try {
			if (!Files.exists(root)) {
				Files.createDirectories(root);
				System.out.println("Directory is created!");
			}
		} catch (IOException e) {
			throw new RuntimeException("Không thể tạo thư mục");
		}

		try {
			Path path = Paths.get("upload/image/student/" + studentCode + "/" + fileName);
//      Files.write(path, file.getBytes());
//      Files.copy(file.getInputStream(), root.resolve(file.getOriginalFilename()));
			Files.write(path, bytes);
		} catch (Exception e) {
			throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
		}
	}

	@Override
	public void saveRollCallImage(byte[] bytes, String classCode, String fileName) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		String dateString = sdf.format(date);
		Path root = Paths.get("upload/image/rollcall/" + classCode + "/" + dateString);
		
		try {
			if (!Files.exists(root)) {
				Files.createDirectories(root);
				System.out.println("Directory is created!");
			}
		} catch (IOException e) {
			throw new RuntimeException("Không thể tạo thư mục");
		}
		
		try {
			Path path = Paths.get("upload/image/rollcall/" + classCode + "/" + dateString + "/" + fileName);
			Files.write(path, bytes);
		} catch (Exception e) {
			throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
		}
	}
	
	@Override
	public Resource load(String filename, String studentCode) {
		Path root = Paths.get("upload/image/student/" + studentCode);
		try {
			Path file = root.resolve(filename);

			Resource resource = new UrlResource(file.toUri());

			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				throw new RuntimeException("Could not read the file!");
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Error: " + e.getMessage());
		}
	}

//  @Override
//  public void deleteAll() {
//    FileSystemUtils.deleteRecursively(root.toFile());
//  }

	@Override
	public Stream<Path> loadAllStudent(String studentCode) {
		Path root = Paths.get("upload/image/student/" + studentCode);
		try {
			return Files.walk(root, 1).filter(path -> !path.equals(root)).map(root::relativize);
		} catch (IOException e) {
			throw new RuntimeException("Could not load the files!");
		}
	}

	@Override
	public void delete(String imageName, String studentCode) {
		File file = new File("upload/image/student/" + studentCode + "/" + imageName);
		file.delete();
	}

}
