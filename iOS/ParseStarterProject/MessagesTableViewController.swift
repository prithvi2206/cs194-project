//
//  MessagesTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class MessagesTableViewController: UITableViewController {
    
    var jobId: PFObject?
    
    var messages: [PFObject]? {
        didSet {
            if messages?.count > 0 {
                tableView.reloadData()
            }
        }
    }

    private func fetchMessages() {
        if (jobId != nil) {
            if let company = jobId!.objectForKey("company") as? String {
                self.title = "Messages: " + company
            } else {
                self.title = "Messages: "
            }
            
            PFQuery(className: "Message").whereKey("userId", equalTo: PFUser.currentUser()).whereKey("appId", equalTo: jobId!).orderByDescending("dateSent").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if let messages = result as? [PFObject] {
                    self.messages = messages
                }
            }
        } else {
            self.title = "Messages: All"
            PFQuery(className: "Message").whereKey("userId", equalTo: PFUser.currentUser()).orderByDescending("dateSent").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if let messages = result as? [PFObject] {
                    self.messages = messages
                }
            }
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.whiteColor();

        fetchMessages()
    }
    
    // MARK: - Table view data source
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if messages != nil {
            return messages!.count
        } else {
            return 0
        }
    }

    private struct Identifiers {
        static let MessageCellReuseIdentifier = "Message Cell"
        static let MessageDetailSegue = "Message Detail Segue"
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.MessageCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let messageCell = cell as? MessageTableViewCell {
        messageCell.message = messages?[indexPath.row]
        return messageCell
        }
        
        return cell
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.MessageDetailSegue:
            if let messageDetailViewController = segue.destinationViewController as? MessageDetailTableViewController {
                if let messageCell = sender as? UITableViewCell {
                    if let indexPath = tableView.indexPathForCell(messageCell) {
                        messageDetailViewController.message = messages?[indexPath.row]
                    }
                }
            }
        default:
            break
        }
    }
}
