package com.rollcallsystem.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelGenerator {
	
	public static ByteArrayInputStream dataToExcel(List<HashMap<String, Object>> studentMap, String className) throws IOException {
		
		List<String> COLUMNS = new ArrayList<String>();
		COLUMNS.add("STT");
		COLUMNS.add("Mã");
		COLUMNS.add("Tên");
		
		@SuppressWarnings("unchecked")
		List<HashMap<String, String>> dataMap = (List<HashMap<String, String>>) studentMap.get(0).get("history");
		
		for (HashMap<String, String> hashMap : dataMap) {
			COLUMNS.add(hashMap.get("date"));
		}
		
		try(
				Workbook workbook = new XSSFWorkbook();
				ByteArrayOutputStream out = new ByteArrayOutputStream();
		){
	 
			Sheet sheet = workbook.createSheet(className);
	 
			Font headerFont = workbook.createFont();
			headerFont.setBold(true);
			headerFont.setColor(IndexedColors.BLUE.getIndex());
	 
			CellStyle headerCellStyle = workbook.createCellStyle();
			headerCellStyle.setFont(headerFont);
	 
			// Row for Header
			Row headerRow = sheet.createRow(0);
	 
			// Header
			for (int col = 0; col < COLUMNS.size(); col++) {
				Cell cell = headerRow.createCell(col);
				cell.setCellValue(COLUMNS.get(col));
				cell.setCellStyle(headerCellStyle);
			}
	 
			int rowIdx = 1;
			for (HashMap<String, Object> hashMap : studentMap) {
				Row row = sheet.createRow(rowIdx++);
				
				row.createCell(0).setCellValue(rowIdx - 1);
				row.createCell(1).setCellValue(hashMap.get("code").toString());
				row.createCell(2).setCellValue(hashMap.get("name").toString());
				int index = 2;
				
				@SuppressWarnings("unchecked")
				List<HashMap<String, Object>> dataList = (List<HashMap<String, Object>>) hashMap.get("history");
				
				for (HashMap<String, Object> value : dataList) {
					index = index + 1;
					if(value.get("status") != null) {
						row.createCell(index).setCellValue(value.get("status").toString());
					}
				}
			}
		
//			File file = new File("C:/Users/khanh/Downloads/excel/" + className + ".xlsx");
//	        file.getParentFile().mkdirs();
//	        FileOutputStream outFile = new FileOutputStream(file);
//	        workbook.write(outFile);
			workbook.write(out);
			return new ByteArrayInputStream(out.toByteArray());
		}
	}
}