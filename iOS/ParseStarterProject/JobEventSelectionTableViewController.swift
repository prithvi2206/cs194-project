//
//  JobEventSelectionTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/18/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobEventSelectionTableViewController: UITableViewController {

    var applications: [PFObject]? {
        didSet {
            if applications?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchApplications() {
        PFQuery(className: "Application").whereKey("userId", equalTo: PFUser.currentUser()).orderByAscending("createdAt").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let applications = result as? [PFObject] {
                self.applications = applications
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.whiteColor()
        
        fetchApplications()
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
        if(applications != nil) {
            return applications!.count + 1
        } else {
            return 1
        }
    }
    
    private struct Identifiers {
        static let ContinueSegue = "Continue Segue"
        static let JobCellIdentifier = "Job Cell"
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.JobCellIdentifier, forIndexPath: indexPath) as UITableViewCell
        
        if(indexPath.row == 0) {
            cell.textLabel.text = "None";
            cell.detailTextLabel?.text = ""
        } else {
            if let company = applications?[indexPath.row-1].objectForKey("company") as? String
            {
                cell.textLabel.text = company
            }
            
            if let title = applications?[indexPath.row-1].objectForKey("title") as? String {
                cell.detailTextLabel?.text = title
            }
        }
        
        return cell
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.ContinueSegue:
            if let newEventTVC = segue.destinationViewController as? NewEventTableViewController {
                let selected = tableView.indexPathForSelectedRow()!
                if selected.row != 0 {
                    newEventTVC.application = self.applications?[selected.row-1]
                } else {
                    newEventTVC.application = nil
                }
            }
        default:
            break
        }
    }
}
