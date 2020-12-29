package com.rollcallsystem.service;

import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;

public interface FilesStorageService {
//  public void init();

  public void saveStudentImage(byte[] bytes, String studentCode, String fileName);
  
  public void saveRollCallImage(byte[] bytes, String classCode, String fileName);

  public Resource load(String filename, String studentCode);

  public void delete(String imageName, String studentCode);

  public Stream<Path> loadAllStudent(String studentCode);
}
