//
//  ContactDetailViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit

class ContactDetailViewController: UIViewController {

    var data: AnyObject? {
        didSet {
            refreshUI()
        }
    }
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var companyPositionLabel: UILabel!
    
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var noteLabel: UILabel!
    
    
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
        
        refreshUI()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
