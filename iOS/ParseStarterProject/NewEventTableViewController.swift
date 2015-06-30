//
//  NewEventTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/18/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class NewEventTableViewController: UITableViewController {
    
    var application: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    private func updateUI() {
        if let company = application?.objectForKey("company") as? String {
            companyLabel?.text = company
        } else {
            companyLabel?.text = "None"
        }
    }

    @IBOutlet weak var companyLabel: UILabel!
    @IBOutlet weak var locationTextField: UITextField!
    @IBOutlet weak var descriptionTextField: UITextField!
    
    @IBAction func saveButton(sender: UIButton) {
        if locationTextField?.text == "" || descriptionTextField == "" {
            var alert = UIAlertController(
                title: "Oops",
                message: "You missed a field...",
                preferredStyle: UIAlertControllerStyle.Alert
            )
            alert.addAction(UIAlertAction(title: "Continue", style: .Cancel, handler: { (action) -> Void in
                // do nothing
            }))
            self.presentViewController(alert, animated: true, completion: nil)

        } else {
            var eventObj = PFObject(className:"Event")
            eventObj["userId"] = PFUser.currentUser()
            if application != nil {
                eventObj["appId"] = application
            }
            
            eventObj["location"] = locationTextField?.text
            eventObj["desc"] = locationTextField?.text
            eventObj.saveInBackgroundWithBlock({ (success, error) -> Void in
                if(success) {
                    var alert = UIAlertController(
                        title: "Event Saved",
                        message: "Your event was saved to inturn.io!",
                        preferredStyle: UIAlertControllerStyle.Alert
                    )
                    alert.addAction(UIAlertAction(title: "Woop!", style: UIAlertActionStyle.Default, handler: { [unowned self] (action) -> Void in
                    }))
                    
                    self.presentViewController(alert, animated: true, completion: { [unowned self] () -> Void in
                        
                        self.navigationController?.popToRootViewControllerAnimated(true)
                        return
                    })
                } else {
                    var alert = UIAlertController(
                        title: "Oops",
                        message: "Something went wrong. This event could not be saved.",
                        preferredStyle: UIAlertControllerStyle.Alert
                    )
                    alert.addAction(UIAlertAction(title: "Continue", style: .Cancel, handler: { (action) -> Void in
                        // do nothing
                    }))
                    self.presentViewController(alert, animated: true, completion: nil)
                }

                
            })
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.whiteColor()
        
        updateUI()
    }
}
