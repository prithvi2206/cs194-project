//
//  DocumentsTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/13/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class DocumentsTableViewController: UITableViewController {

    var jobId: PFObject?
    
    var documents: [PFObject]? {
        didSet {
            if documents?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchDocuments() {
        if (jobId != nil) {
            if let company = jobId!.objectForKey("company") as? String {
                self.title = "Documents: " + company
            } else {
                self.title = "Documents"
            }
            
            PFQuery(className: "Document").whereKey("userId", equalTo: PFUser.currentUser()).whereKey("appId", containedIn: [jobId!.objectId]).orderByDescending("createdAt").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if let documents = result as? [PFObject] {
                    self.documents = documents
                }
            }
        } else {
            self.title = "Documents: All"
            PFQuery(className: "Document").whereKey("userId", equalTo: PFUser.currentUser()).orderByDescending("createdAt").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if let documents = result as? [PFObject] {
                    self.documents = documents
                }
            }
        }
        
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        fetchDocuments()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.whiteColor()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    private struct Identifiers {
        static let DocumentCellReuseIdentifier = "Document Cell"
        static let DocumentViewSegue = "Document Preview Segue"
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.DocumentViewSegue:
            if let documentViewController = segue.destinationViewController as? DocumentViewController {
                if let documentCell = sender as? DocumentTableViewCell {
                    documentViewController.data = documentCell.data
                }
            }
        default:
            break
        }
    }
    
    // MARK: - Table view data source
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if documents != nil {
            return documents!.count
        } else {
            return 0
        }
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifiers.DocumentCellReuseIdentifier, forIndexPath: indexPath) as UITableViewCell
        if let documentCell = cell as? DocumentTableViewCell {
        documentCell.data = documents?[indexPath.row]
        return documentCell
        }
        
        return cell
    }
}
