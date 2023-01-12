package com.example.restapi.controllers;

import Archivates.ZipArchivate;
import com.example.restapi.FileUploadResponse;
import com.example.restapi.utils.FileUploadUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class FileUploadController {

    @PostMapping("/uploadFile")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile multipartFile)
            throws IOException {

        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        long size = multipartFile.getSize();

        FileUploadUtil.saveFile(fileName, multipartFile);

        FileUploadResponse response = new FileUploadResponse();
        response.setFileName(fileName);
        response.setSize(size);
        response.setDownloadUri("/downloadFile");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/unZip")
    public ResponseEntity<FileUploadResponse> unZip(@RequestBody String filename) {
        try {
            String unarchivateFileName = ZipArchivate.unarchivate(filename);
            Path unarchivateFilePath = Paths.get("__fixtures__/" + unarchivateFileName);
            long size = Files.size(unarchivateFilePath);

            FileUploadResponse response = new FileUploadResponse();

            response.setFileName(unarchivateFileName);
            response.setSize(size);
            response.setDownloadUri("/downloadFile");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    };


}