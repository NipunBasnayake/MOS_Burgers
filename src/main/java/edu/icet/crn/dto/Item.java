package edu.icet.crn.dto;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table
public class Item {
    private int id;
    private String name;
    private double price;
    private int quantity;
    private String type;
    private String image;
    private String expiryDate;
}
