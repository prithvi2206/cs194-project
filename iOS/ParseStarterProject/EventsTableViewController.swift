//
//  EventsTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class EventsTableViewController: UITableViewController {

    var jobId: PFObject?
    
    var events: [PFObject]? {
        didSet {
            if events?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchEvents() {
        if (jobId != nil) {
            if let company = jobId!.objectForKey("company") as? String {
                self.title = "Events: " + company
            } else {
                self.title = "Events: All"
            }
            PFQuery(className: "Event").whereKey("userId", equalTo: PFUser.currentUser()).whereKey("appId", equalTo: jobId!).includeKey("appId").orderByAscending("datetime").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if let events = result as? [PFObject] {
                    self.events = events
                }
            }
        } else {
            super.title = "Events: All"
            PFQuery(className: "Event").whereKey("userId", equalTo: PFUser.currentUser()).includeKey("appId").orderByAscending("datetime").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if let events = result as? [PFObject] {
                    self.events = events
                }
            }
        }
        
    }
    
    func segueToJobSelectionForm() {
        performSegueWithIdentifier("Job Selection Segue", sender: self)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        super.title = "Events"
        tableView.backgroundColor = UIColor.whiteColor()
        
        var importContactButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Add, target: self, action: "segueToJobSelectionForm")
        self.navigationItem.rightBarButtonItem = importContactButton

        fetchEvents()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if events != nil {
            return events!.count
        } else {
            return 0
        }
    }

    private struct Identifiers {
        static let EventCellReuseIdentifier = "Event Cell"
        static let EventDetailSegue = "Event Detail Segue"
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.EventCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let eventCell = cell as? EventTableViewCell {
            eventCell.event = events?[indexPath.row]
            return eventCell
        }
        
        return cell
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.EventDetailSegue:
            if let eventDetailViewController = segue.destinationViewController as? EventDetailTableViewController {
                if let eventCellIndexPath = tableView.indexPathForCell(sender as EventTableViewCell) {
                    eventDetailViewController.event = events![eventCellIndexPath.row]
                }
            }
        default:
            break
        }
    }
}
