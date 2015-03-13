//
//  JobDetailTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobDetailTableViewController: UITableViewController {

    @IBOutlet weak var companyLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var deadlineLabel: UILabel!
    @IBOutlet weak var urlLabel: UILabel!
    
    
    @IBOutlet var jobDetailTableView: UITableView!
    
    var job: PFObject? {
        didSet {
            tableView.reloadData()
            updateUI()
        }
    }
    
    private func updateUI() {
        if(job != nil) {
            if let company = job!.objectForKey("company") as? String {
                companyLabel?.text = company
            } else {
                companyLabel?.text = "Not available"
            }
            
            if let title = job!.objectForKey("title") as? String {
                titleLabel?.text = title
            } else {
                titleLabel?.text = "Not available"
            }
            
            if let description = job!.objectForKey("description") as? String {
                descriptionLabel?.text = description
            } else {
                descriptionLabel?.text = "Not available"
            }
            
            if let status = job!.objectForKey("status") as? String {
                switch status {
                case "not_applied":
                    statusLabel?.text = "Need to apply"
                case "applied":
                    statusLabel?.text = "Have Applied"
                case "interview":
                    statusLabel?.text = "Interview Stage"
                case "offer":
                    statusLabel?.text = "Offer Stage"
                case "no_offer":
                    statusLabel?.text = "No offer"
                default:
                    statusLabel?.text = "Not available"
                }
            }
            
            if let deadline = job!.objectForKey("deadline") as? NSDate {
                let dateFormatter = NSDateFormatter()
                dateFormatter.dateFormat = "MMM dd, y"
                deadlineLabel?.text = dateFormatter.stringFromDate(deadline)
            } else {
                deadlineLabel?.text = "Not available"
            }
            
            if let url = job!.objectForKey("url") as? String {
                urlLabel?.text = url
            } else {
                urlLabel?.text = "Not available"
            }

        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        companyLabel?.text = ""
        titleLabel?.text = ""
        descriptionLabel?.text = ""
        statusLabel?.text = ""
        deadlineLabel?.text = ""
        urlLabel?.text = ""
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        if (tableView == jobDetailTableView) {
            return 1
        } else {
            return 0
        }
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if (tableView == jobDetailTableView) {
            return 3
        } else {
            return 0
        }
    }
    
    private struct Identifiers {
        static let JobMessagesSegue = "Job Messages Segue"
        static let JobDocumentsSegue = "Job Documents Segue"
        static let JobContactsSegue = "Job Contacts Segue"
        static let JobEventsSegue = "Job Events Segue"
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.JobMessagesSegue:
            if let messagesTableViewController = segue.destinationViewController as? MessagesTableViewController {
                messagesTableViewController.jobId = job
            }
        case Identifiers.JobDocumentsSegue:
            if let documentsTableViewController = segue.destinationViewController as? DocumentsTableViewController {
                documentsTableViewController.jobId = job
            }
        case Identifiers.JobContactsSegue:
            if let contactsTableViewController = segue.destinationViewController as? ContactsTableViewController {
                contactsTableViewController.jobId = job
            }
        case Identifiers.JobEventsSegue:
            if let eventsTableViewController = segue.destinationViewController as? EventsTableViewController {
                eventsTableViewController.jobId = job
            }
        default:
            break
        }
    }
}
