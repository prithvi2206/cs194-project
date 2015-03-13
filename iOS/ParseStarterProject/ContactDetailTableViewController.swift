//
//  ContactDetailTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/11/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit

class ContactDetailTableViewController: UITableViewController {

    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var companyPositionLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var noteLabel: UILabel!
        
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
        nameLabel?.text = ""
        companyPositionLabel?.text = ""
        phoneNumberLabel?.text = ""
        emailLabel?.text = ""
        noteLabel?.text = ""
        
        refreshUI()
    }
}
