//
//  NewContactTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/11/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import AddressBook
import AddressBookUI

class NewContactTableViewController: UITableViewController, ABPeoplePickerNavigationControllerDelegate {

    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var titleTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var phoneNumberTextField: UITextField!
    @IBOutlet weak var companyTextField: UITextField!
    @IBOutlet weak var notesTextField: UITextField!
    
    @IBAction func showContactPicker(sender: UIButton) {
        var picker = ABPeoplePickerNavigationController()
        picker.peoplePickerDelegate = self
        
        self.presentViewController(picker, animated: true) { () -> Void in
        }
    }
    
    func peoplePickerNavigationController(peoplePicker: ABPeoplePickerNavigationController!, didSelectPerson person: ABRecord!) {
        if let first_name = ABRecordCopyValue(person, kABPersonFirstNameProperty)?.takeRetainedValue() as? String {
            nameTextField.text = first_name + " "
        }
        
        if let last_name = ABRecordCopyValue(person, kABPersonLastNameProperty)?.takeRetainedValue() as? String {
            if(nameTextField.text == "") {
                nameTextField.text = last_name
            } else {
                nameTextField.text = nameTextField.text + last_name
            }
        }
        
        if let company_name = ABRecordCopyValue(person, kABPersonOrganizationProperty)?.takeRetainedValue() as? String
        {
            companyTextField.text = company_name
        }
        
        if let job_title = ABRecordCopyValue(person, kABPersonJobTitleProperty)?.takeRetainedValue() as? String {
            titleTextField.text = job_title
        }
        
        if let email: ABMultiValueRef = ABRecordCopyValue(person, kABPersonEmailProperty)?.takeRetainedValue(){
            if (ABMultiValueGetCount(email) > 0) {
                if let email = ABMultiValueCopyValueAtIndex(email, 0).takeRetainedValue() as? String {
                    emailTextField.text = email
                }
            }
        }
        
        if let phone: ABMultiValueRef = ABRecordCopyValue(person, kABPersonPhoneProperty)?.takeRetainedValue() {
            if (ABMultiValueGetCount(phone) > 0) {
                if let phone = ABMultiValueCopyValueAtIndex(phone, 0).takeRetainedValue() as? String {
                    phoneNumberTextField.text = phone
                }
            }
        }
        
        if let note: CFStringRef = ABRecordCopyValue(person, kABPersonNoteProperty)?.takeRetainedValue() as? String {
            
            println(note)
            
        }
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
