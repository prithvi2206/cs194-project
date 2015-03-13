//
//  EventDetailTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse
import EventKit

class EventDetailTableViewController: UITableViewController {

    var event: PFObject? {
        didSet {
            updateUI()
        }
    }
    
    @IBOutlet weak var companyLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    
    
    private func updateUI() {
        if(event != nil) {
            if let applicationObj = event!.objectForKey("applicationId") as? PFObject {
                if let company_name = applicationObj.objectForKey("company") as? String {
                    companyLabel?.text = company_name
                }
            }
            
            if let date = event!.objectForKey("datetime") as? NSDate {
                let dateFormatter = NSDateFormatter()
                let timeFormatter = NSDateFormatter()
                dateFormatter.dateFormat = "MMM dd, y"
                timeFormatter.dateFormat = "h:mm a"
                
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
            }
            
            if let location = event!.objectForKey("location") as? String {
                locationLabel?.text = location
            }
            
            if let description = event!.objectForKey("desc") as? String {
                descriptionLabel?.text = description
            }
        }
    }
    
    @IBAction func saveEvent(sender: UIButton) {
        if event != nil {
            var eventStore: EKEventStore = EKEventStore()
            
            eventStore.requestAccessToEntityType(EKEntityTypeEvent, completion: { [unowned self] (granted, error) -> Void in
                if(granted && error == nil) {
                    var ek_event: EKEvent = EKEvent(eventStore: eventStore)
                    
                    if let applicationObj = self.event!.objectForKey("applicationId") as? PFObject {
                        if let company_name = applicationObj.objectForKey("company") as? String {
                            ek_event.title = company_name
                        }
                    }
                    
                    if let date = self.event!.objectForKey("datetime") as? NSDate {
                        ek_event.startDate = date
                        ek_event.endDate = date
                    }
                    
                    if let location = self.event!.objectForKey("location") as? String {
                        ek_event.location = location
                    }
                    
                    if let description = self.event!.objectForKey("desc") as? String {
                        ek_event.notes = description
                    }
                    
                    ek_event.calendar = eventStore.defaultCalendarForNewEvents
                    if(eventStore.saveEvent(ek_event, span: EKSpanThisEvent, error: nil)) {
                        var alert = UIAlertController(
                            title: "Event Saved",
                            message: "This event was successfully saved to your calendar.",
                            preferredStyle: UIAlertControllerStyle.Alert
                        )
                        alert.addAction(UIAlertAction(title: "Woop!", style: .Default, handler: { (action) -> Void in
                            // do nothing
                        }))
                        self.presentViewController(alert, animated: true, completion: nil)
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
                } else {
                    var alert = UIAlertController(
                        title: "Access denied",
                        message: "This application is not authorized to access your calendar.",
                        preferredStyle: UIAlertControllerStyle.Alert
                    )
                    alert.addAction(UIAlertAction(title: "Continue", style: .Cancel, handler: { (action) -> Void in
                        // do nothing
                    }))
                    self.presentViewController(alert, animated: true, completion: nil)
                }
            });
        }
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()

        companyLabel?.text = nil
        locationLabel?.text = nil
        descriptionLabel?.text = nil
        dateLabel?.text = nil
        
        updateUI()
    }
}
