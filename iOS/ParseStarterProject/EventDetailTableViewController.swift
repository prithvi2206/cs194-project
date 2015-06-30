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
    @IBOutlet weak var startLabel: UILabel!
    @IBOutlet weak var endLabel: UILabel!
    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    
    
    private func updateUI() {
        if(event != nil) {
            if let company = event!.objectForKey("appId").objectForKey("company") as? String {
                companyLabel?.text = company
            } else {
                companyLabel?.text = "Not available"
            }
            
            let dateFormatter = NSDateFormatter()
            let timeFormatter = NSDateFormatter()
            dateFormatter.dateFormat = "MMM dd, y"
            timeFormatter.dateFormat = "h:mm a"
            
            let calendar = NSCalendar.currentCalendar()
            let today = NSDate()
            let components2 = calendar.components(.CalendarUnitDay, fromDate: today)
            
            if let start = event!.objectForKey("start") as? NSDate {
                let components1 = calendar.components(.CalendarUnitDay, fromDate: start)
                
                if((components1.day - components2.day) == 0) {
                    startLabel?.text = "Today " + timeFormatter.stringFromDate(start)
                } else {
                    startLabel?.text = dateFormatter.stringFromDate(start) + " at " + timeFormatter.stringFromDate(start)
                }
            } else {
                startLabel?.text = "Not available"
            }
            
            if let end = event!.objectForKey("end") as? NSDate {
                let components1 = calendar.components(.CalendarUnitDay, fromDate: end)
                
                if((components1.day - components2.day) == 0) {
                    endLabel?.text = "Today " + timeFormatter.stringFromDate(end)
                } else {
                    endLabel?.text = dateFormatter.stringFromDate(end) + " at " + timeFormatter.stringFromDate(end)
                }
            } else {
                endLabel?.text = "Not available"
            }
            
            if let location = event!.objectForKey("location") as? String {
                locationLabel?.text = location
            } else {
                locationLabel?.text = "Not available"
            }
            
            if let description = event!.objectForKey("desc") as? String {
                descriptionLabel?.text = description
            } else {
                descriptionLabel?.text = "Not available"
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
                    
                    if let start = self.event!.objectForKey("start") as? NSDate {
                        ek_event.startDate = start
                    }
                    
                    if let end = self.event!.objectForKey("end") as? NSDate {
                        ek_event.endDate = end
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
        tableView.backgroundColor = UIColor.whiteColor()

        companyLabel?.text = nil
        locationLabel?.text = nil
        descriptionLabel?.text = nil
        startLabel?.text = nil
        endLabel?.text = nil
        
        updateUI()
    }
}
