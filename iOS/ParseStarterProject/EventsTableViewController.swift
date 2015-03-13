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

    var events: [PFObject]? {
        didSet {
            if events?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchEvents() {
        PFQuery(className: "Event").whereKey("userId", equalTo: PFUser.currentUser()).includeKey("applicationId").orderByAscending("datetime").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let events = result as? [PFObject] {
                self.events = events
            }
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        super.title = "Events"

        fetchEvents()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
        static let DocumentViewSegue = "Document Preview Segue"
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.EventCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let eventCell = cell as? EventTableViewCell {
            eventCell.event = events?[indexPath.row]
            return eventCell
        }
        
        return cell
    }
}
