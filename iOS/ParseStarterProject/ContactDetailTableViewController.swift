//
//  ContactDetailTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/11/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import AddressBook

class ContactDetailTableViewController: UITableViewController {

    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var companyPositionLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var noteLabel: UILabel!
        
    @IBAction func saveContact(sender: UIButton) {
        if data != nil {
            var emptyDictionary: CFDictionaryRef?
            var addressBook: ABAddressBookRef?
            
            if(ABAddressBookGetAuthorizationStatus() == ABAuthorizationStatus.NotDetermined)
            {
                println("requesting access...")
                addressBook = ABAddressBookCreateWithOptions(emptyDictionary, nil).takeRetainedValue()
                ABAddressBookRequestAccessWithCompletion(addressBook, { (success, error) -> Void in
                    if(success) {
                        println("success");
                    }
                })
            } else if (ABAddressBookGetAuthorizationStatus() == ABAuthorizationStatus.Denied || ABAddressBookGetAuthorizationStatus() == ABAuthorizationStatus.Restricted) {
                var alert = UIAlertController(
                    title: "Access denied",
                    message: "This application is not authorized to access your contacts.",
                    preferredStyle: UIAlertControllerStyle.Alert
                )
                alert.addAction(UIAlertAction(title: "Continue", style: .Cancel, handler: { (action) -> Void in
                    // do nothing
                }))
                presentViewController(alert, animated: true, completion: nil)
            } else if (ABAddressBookGetAuthorizationStatus() == ABAuthorizationStatus.Authorized) {
                println("access granted");
                addressBook = ABAddressBookCreateWithOptions(emptyDictionary, nil).takeRetainedValue()
            }
        
            var person: ABRecordRef = ABPersonCreate().takeRetainedValue()
            
            if let name = data!.objectForKey("name") as? String {
                var nameArr = split(name) {$0 == " "}
                if(nameArr.count == 1) {
                    ABRecordSetValue(person, kABPersonFirstNameProperty, nameArr[0] as CFStringRef, nil)
                } else if(nameArr.count == 2) {
                    ABRecordSetValue(person, kABPersonFirstNameProperty, nameArr[0] as CFStringRef, nil)
                    ABRecordSetValue(person, kABPersonLastNameProperty, nameArr[1] as CFStringRef, nil)
                } else if(nameArr.count == 3) {
                    ABRecordSetValue(person, kABPersonFirstNameProperty, nameArr[0] as CFStringRef, nil)
                    ABRecordSetValue(person, kABPersonMiddleNameProperty, nameArr[1] as CFStringRef, nil)
                    ABRecordSetValue(person, kABPersonLastNameProperty, nameArr[2] as CFStringRef, nil)
                }
            }
            
            if let company = data!.objectForKey("company") as? String {
                ABRecordSetValue(person, kABPersonOrganizationProperty, company as CFStringRef, nil)
            }
            
            if let position = data!.objectForKey("title") as? String {
                ABRecordSetValue(person, kABPersonJobTitleProperty, position as CFStringRef, nil)
            }
            
            if let phoneNumber = data!.objectForKey("phone") as? String {
                var phoneNumberMultiValue: ABMutableMultiValue = ABMultiValueCreateMutable(ABPropertyType(kABMultiStringPropertyType)).takeRetainedValue()
                ABMultiValueAddValueAndLabel(phoneNumberMultiValue, phoneNumber as CFStringRef, kABPersonPhoneMainLabel, nil)
                ABRecordSetValue(person, kABPersonPhoneProperty, phoneNumberMultiValue, nil)
            }
            
            if let email = data!.objectForKey("email") as? String {
                var emailMultiValue: ABMutableMultiValue = ABMultiValueCreateMutable(ABPropertyType(kABMultiStringPropertyType)).takeRetainedValue()
                ABMultiValueAddValueAndLabel(emailMultiValue, email as CFStringRef, kABPersonPhoneMainLabel, nil)
                ABRecordSetValue(person, kABPersonEmailProperty, emailMultiValue, nil)
            }
            
            if let note = data!.objectForKey("notes") as? String {
                ABRecordSetValue(person, kABPersonNoteProperty, note as CFStringRef, nil)
            }
            
            if(ABAddressBookAddRecord(addressBook, person, nil) && ABAddressBookSave(addressBook, nil)) {
                var alert = UIAlertController(
                    title: "Contact Saved",
                    message: "Contact was saved to your phone.",
                    preferredStyle: UIAlertControllerStyle.Alert
                )
                alert.addAction(UIAlertAction(title: "Woop!", style: .Default, handler: { (action) -> Void in
                    // do nothing
                }))
                presentViewController(alert, animated: true, completion: nil)
            } else {
                var alert = UIAlertController(
                    title: "Error",
                    message: "Something went wrong. This contact could not be saved.",
                    preferredStyle: UIAlertControllerStyle.Alert
                )
                alert.addAction(UIAlertAction(title: "Continue", style: .Cancel, handler: { (action) -> Void in
                    // do nothing
                }))
                presentViewController(alert, animated: true, completion: nil)
            }
        }
    }
    var data: AnyObject? {
        didSet {
            refreshUI()
        }
    }
    
    private func refreshUI() {
        if data != nil {
            if let name = data!.objectForKey("name") as? String {
                nameLabel?.text = name
            }
            
            if let company = data!.objectForKey("company") as? String {
                if let position = data!.objectForKey("title") as? String {
                    companyPositionLabel?.text = company + " - " + position
                } else  {
                    companyPositionLabel?.text = company
                }
            }
            
            if let phoneNumber = data!.objectForKey("phone") as? String {
                phoneNumberLabel?.text = phoneNumber
            }
            
            if let email = data!.objectForKey("email") as? String {
                emailLabel?.text = email
            }
            
            if let note = data!.objectForKey("notes") as? String {
                noteLabel?.text = note
            }
        }
    }

    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.whiteColor()
        
        nameLabel?.text = ""
        companyPositionLabel?.text = ""
        phoneNumberLabel?.text = ""
        emailLabel?.text = ""
        noteLabel?.text = ""
        
        refreshUI()
    }
}
