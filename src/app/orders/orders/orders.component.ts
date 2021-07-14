import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/models/object-model';
import { OrderService } from 'src/app/shared/services/order.service';
declare var jQuery: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
// //changes
// all_order_data = all_order_data;
// addEditProductForm = editOrderForm;
// addEditProduct = editOrderVar
// addEditProductModal = editOrderVarModal
// edit_order
// edit_order_id
// order_data
// product_dto
// product_service
// getAllProduct()
// deleteProduct()*****
// 
// ///

  all_order_data;
  editOrderForm: FormGroup;
  editOrderVar: boolean = false;//for form validation
  popup_header: string;
  edit_order: boolean;

  order_data;
  order_dto: Order;

  single_order_data;
  edit_order_id;
  edit_order_date

  user_role;
  user_session_id;

  constructor(private formBuilder: FormBuilder, private router: Router, private order_service: OrderService) { }

  ngOnInit() {
    this.user_role = sessionStorage.getItem("role");
    this.user_session_id = sessionStorage.getItem("user_session_id");
    
    this.editOrderForm = this.formBuilder.group({
      status: ['', Validators.required],
      productDesc: ['', Validators.required],
    })
    if(this.user_role == 'buyer'){
      this.getSepecificUserOrder(this.user_session_id)
    }
    if(this.user_role == 'seller'){
      this.getAllOrder();
    }
  }

  get rf() { return this.editOrderForm.controls; }

  getSepecificUserOrder(user_session_id) {
    this.order_service.getSingleUserOrder(user_session_id).subscribe(data => {
      this.all_order_data = data;
      // console.log("all_order_data:::::::::::", data);
      
    }, error => {
      console.log("My error", error);
    })
  }

  getAllOrder() {
    this.order_service.allOrder().subscribe(data => {
      this.all_order_data = data;
      // console.log("all_order_data:::::::::::", data);
      
    }, error => {
      console.log("My error", error);
    })
  }

  editOrderPopup(id) {
    this.edit_order = true;
    this.popup_header = "Edit Order";
    this.editOrderForm.reset();
    this.order_service.singleOrder(id).subscribe(data => {
      this.single_order_data = data;
      this.edit_order_id = data.id;
      this.edit_order_date= data.dateTime;
      console.log("single_order_data", this.single_order_data);

      // this.editOrderForm.setValue({
      //   name: this.single_order_data.name,
      //   // uploadPhoto: '',
      //   uploadPhoto: this.single_order_data.uploadPhoto,
      //   productDesc: this.single_order_data.productDesc,
      //   mrp: this.single_order_data.mrp,
      //   dp: this.single_order_data.dp,
      //   status: this.single_order_data.status
      // })
    })
  }

  updateOrder() {
    this.editOrderVar = true;
    if (this.editOrderForm.invalid) {
      alert('Error!! :-)\n\n' + JSON.stringify(this.editOrderForm.value))
      return;
    }
    this.order_data = this.editOrderForm.value;
    this.order_dto = {
      id: this.single_order_data.product.id,
      userId: this.single_order_data.userId,
      sellerId: this.single_order_data.sellerId,
      product: {
        id: this.single_order_data.product.id,
        name: this.single_order_data.product.name,
        uploadPhoto: this.single_order_data.product.uploadPhoto,
        productDesc: this.single_order_data.product.productDesc,
        mrp: this.single_order_data.product.mrp,
        dp: this.single_order_data.product.dp,
        status: this.single_order_data.product.status,
      },
      deliveryAddress: {
        id: this.single_order_data.deliveryAddress.id,
        addLine1: this.single_order_data.deliveryAddress.addLine1,
        addLine2: this.single_order_data.deliveryAddress.addLine2,
        city: this.single_order_data.deliveryAddress.city,
        state: this.single_order_data.deliveryAddress.state,
        zipCode: this.single_order_data.deliveryAddress.zipCode,
      },
      contact: this.single_order_data.mobNumber,
      dateTime: this.single_order_data.dateTime,
      status: this.order_data.status,
      description: this.order_data.productDesc
    }
    this.order_service.updateOrderStatus(this.edit_order_id, this.order_dto).subscribe(data => {
      // console.log(data);
      jQuery('#editOrderVarModal').modal('toggle');
      window.location.reload();
      this.getAllOrder();
    }, err => {
      alert("Some Error Occured");
    })
  }
}