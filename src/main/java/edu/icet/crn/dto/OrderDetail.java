package edu.icet.crn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OrderDetail {
    private Integer id;
    private Integer orderId;
    private Integer itemId;
    private Integer quantity;
    private Double unitPrice;
}
