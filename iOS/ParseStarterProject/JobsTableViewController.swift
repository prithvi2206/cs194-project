//
//  JobsTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobsTableViewController: UITableViewController {

    var jobs: [PFObject]? {
        didSet {
            if jobs?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchJobs() {
        PFQuery(className: "Application").whereKey("userId", equalTo: PFUser.currentUser()).orderByAscending("company").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let jobs = result as? [PFObject] {
                self.jobs = jobs
            }
        }
        
    }
    
    private struct Identifiers {
        static let JobCellReuseIdentifier = "Job Cell"
        static let JobDetailSegue = "Job Detail Segue"
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        super.title = "Job Applications"
        tableView.backgroundColor = UIColor.whiteColor()


        fetchJobs()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if jobs != nil {
            return jobs!.count
        } else {
            return 0
        }
    }

    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.JobDetailSegue:
            if let jobDetailTableViewController = segue.destinationViewController as? JobDetailTableViewController {
                if let jobCell = sender as? UITableViewCell {
                    if let indexPath = self.tableView.indexPathForCell(jobCell) {
                        jobDetailTableViewController.job = jobs?[indexPath.row]
                    }
                }
            }
        default:
            break
        }
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.JobCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let jobCell = cell as? JobTableViewCell {
            jobCell.job = jobs?[indexPath.row]
            return jobCell
        }
        
        return cell
    }
}
