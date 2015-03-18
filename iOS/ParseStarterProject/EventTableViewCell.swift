//
//  EventTableViewCell.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class EventTableViewCell: UITableViewCell {

    var event: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    @IBOutlet weak var companyLabel: UILabel!
    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    

    private func updateUI() {
        companyLabel?.text = nil
        locationLabel?.text = nil
        descriptionLabel?.text = nil
        dateLabel?.text = nil
        
        if event != nil {
            if let applicationObj = event!.objectForKey("applicationId") as? PFObject {
                if let company_name = applicationObj.objectForKey("company") as? String {
                    companyLabel?.text = company_name
                }
            }
            
            if let location = event!.objectForKey("location") as? String {
                locationLabel?.text = location
            }
            
            if let description = event!.objectForKey("desc") as? String {
                descriptionLabel?.text = description
            }
            
            if let date = event!.objectForKey("datetime") as? NSDate {
                let dateFormatter = NSDateFormatter()
                let timeFormatter = NSDateFormatter()
                dateFormatter.dateFormat = "MMM dd, y"
                timeFormatter.dateFormat = "h:mm a"
                
                dateLabel?.text = timeFormatter.stringFromDate(date)
                
                /*
                var calendar = NSCalendar.currentCalendar()
                var components1 = calendar.components(.CalendarUnitDay, fromDate: date)
                let today = NSDate()
                var components2 = calendar.components(.CalendarUnitDay, fromDate: today)
                
                if((components1.day - components2.day) == 0) {
                    dateLabel?.text = "Today at " + timeFormatter.stringFromDate(date)
                } else if ((components1.day - components2.day) > 0) {
                    dateLabel?.text = dateFormatter.stringFromDate(date) + " at " + timeFormatter.stringFromDate(date)
                } else {
                    dateLabel?.text = "Was on " + dateFormatter.stringFromDate(date) + " at " + timeFormatter.stringFromDate(date)
                }
                */
            }
        }
    }

}
