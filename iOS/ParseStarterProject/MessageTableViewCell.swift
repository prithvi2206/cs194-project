//
//  MessageTableViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class MessageTableViewCell: UITableViewCell {
    var message: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    @IBOutlet weak var senderLabel: UILabel!
    @IBOutlet weak var subjectLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var bodyLabel: UILabel!
    
    private func updateUI() {
        senderLabel?.text = nil
        subjectLabel?.text = nil
        timeLabel?.text = nil
        bodyLabel?.text = nil

        if message != nil {
            if let sender = message!.objectForKey("senderName") as? String {
                senderLabel?.text = sender
            }
            
            if let subject = message!.objectForKey("subject") as? String {
                subjectLabel?.text = subject
            }
        
            if let body = message!.objectForKey("snippet") as? String {
                bodyLabel?.text = body
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
                
                timeLabel?.text = dateFormatter.stringFromDate(date)
            }
        }
    }
}
