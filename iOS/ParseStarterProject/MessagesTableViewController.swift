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
    
    var messages: [PFObject]? {
        didSet {
            if messages?.count > 0 {
                tableView.reloadData()
            }
        }
    }

    private func fetchMessages() {
        PFQuery(className: "Message").whereKey("userId", equalTo: PFUser.currentUser()).orderByDescending("dateSent").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let messages = result as? [PFObject] {
                self.messages = messages
            }
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Messages"

        fetchMessages()
        
        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
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
        static let DocumentViewSegue = "Document Preview Segue"
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.MessageCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let messageCell = cell as? MessageTableViewCell {
        messageCell.message = messages?[indexPath.row]
        return messageCell
        }
        
        return cell
    }
}
