//
//  MessageDetailTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class MessageDetailTableViewController: UITableViewController {

    @IBOutlet weak var subjectLabel: UILabel!
    @IBOutlet weak var senderLabel: UILabel!
    @IBOutlet weak var dateTimeLabel: UILabel!
    @IBOutlet weak var messageLabel: UILabel!
    
    
    var message: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    
    
    private func updateUI() {
        if(message != nil) {
            if let sender = message!.objectForKey("senderName") as? String {
                senderLabel?.text = sender
            }
            
            if let subject = message!.objectForKey("subject") as? String {
                subjectLabel?.text = subject
            }
            
            if let body = message!.objectForKey("bodyText") as? String {
                messageLabel?.text = body
            }
            
            if let date = message!.objectForKey("dateSent") as? NSDate {
                let dateFormatter = NSDateFormatter()
                
                var calendar = NSCalendar.currentCalendar()
                var components = calendar.components(.CalendarUnitDay, fromDate: date)
                
                if(components.day > 1) {
                    dateFormatter.dateFormat = "MMM dd, y"
                } else {
                    dateFormatter.dateFormat = "h:mm a"
                }
                
                dateTimeLabel?.text = dateFormatter.stringFromDate(date)
            }
        }
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        subjectLabel?.text = ""
        senderLabel?.text = ""
        dateTimeLabel?.text = ""
        messageLabel?.text = ""
        
        updateUI()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

}
