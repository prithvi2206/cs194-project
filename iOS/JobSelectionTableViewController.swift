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
        
        fetchApplications()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        // #warning Potentially incomplete method implementation.
        // Return the number of sections.
        return 1
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete method implementation.
        // Return the number of rows in the section.
        if(applications != nil) {
            return applications!.count + 1
        } else {
            return 1
        }
    }

    private struct Identifiers {
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

    /*
    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            // Delete the row from the data source
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(tableView: UITableView, moveRowAtIndexPath fromIndexPath: NSIndexPath, toIndexPath: NSIndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(tableView: UITableView, canMoveRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
    }
    */

}
