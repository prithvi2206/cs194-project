//
//  JobSelectionTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/11/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobSelectionTableViewController: UITableViewController {

    var contact: [String: String]!
    
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
    
    private struct Identifiers {
        static let SuccessfulSaveSegue = "Successful Save Segue"
        static let JobCellIdentifier = "Job Cell"
    }
    
    @IBAction func saveButton(sender: UIButton) {
        let selected = tableView.indexPathForSelectedRow()!
        
        var contactObj = PFObject(className:"Contact")
        contactObj["name"] = contact["name"]
        contactObj["company"] = contact["company"]
        contactObj["title"] = contact["title"]
        contactObj["notes"] = contact["notes"]
        contactObj["email"] = contact["email"]
        contactObj["phone"] = contact["phone_number"]
        contactObj["userId"] = PFUser.currentUser()
        
        if(selected.row != 0 && applications != nil) {
            contactObj["appId"] = applications![selected.row-1]
        }
        
        contactObj.saveInBackgroundWithBlock { [unowned self] (success, error) -> Void in
            if(success) {
                var alert = UIAlertController(
                    title: "Contact Saved",
                    message: "Your contact was saved to inturn.io!",
                    preferredStyle: UIAlertControllerStyle.Alert
                )
                alert.addAction(UIAlertAction(title: "Woop!", style: UIAlertActionStyle.Default, handler: { [unowned self] (action) -> Void in
                }))
                
                self.presentViewController(alert, animated: true, completion: { [unowned self] () -> Void in
                    
                    self.navigationController?.popToRootViewControllerAnimated(true)
                    return
                })
            } else {
                var alert = UIAlertController(
                    title: "Oops",
                    message: "Something went wrong. This contact could not be saved.",
                    preferredStyle: UIAlertControllerStyle.Alert
                )
                alert.addAction(UIAlertAction(title: "Continue", style: .Cancel, handler: { (action) -> Void in
                    // do nothing
                }))
                self.presentViewController(alert, animated: true, completion: nil)
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.backgroundColor = UIColor.whiteColor()
        
        fetchApplications()
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        
        tableView.selectRowAtIndexPath(NSIndexPath(forRow: 0, inSection: 0), animated: true, scrollPosition: UITableViewScrollPosition.Bottom)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
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
}
