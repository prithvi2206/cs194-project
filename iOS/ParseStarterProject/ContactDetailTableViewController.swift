//
//  ContactDetailTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/11/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit

class ContactDetailTableViewController: UITableViewController {

    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var companyPositionLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var noteLabel: UILabel!
        
    var data: AnyObject? {
        didSet {
            refreshUI()
        }
    }
    
    private func refreshUI() {
        if data != nil {
            if let name = data!.objectForKey("name") as? String {
                nameLabel?.text = name
            }
            
            if let company = data!.objectForKey("company") as? String {
                if let position = data!.objectForKey("title") as? String {
                    companyPositionLabel?.text = company + " - " + position
                } else  {
                    companyPositionLabel?.text = company
                }
            }
            
            if let phoneNumber = data!.objectForKey("phone") as? String {
                phoneNumberLabel?.text = phoneNumber
            }
            
            if let email = data!.objectForKey("email") as? String {
                emailLabel?.text = email
            }
            
            if let note = data!.objectForKey("notes") as? String {
                noteLabel?.text = note
            }
        }
    }

    
    override func viewDidLoad() {
        super.viewDidLoad()
        nameLabel?.text = ""
        companyPositionLabel?.text = ""
        phoneNumberLabel?.text = ""
        emailLabel?.text = ""
        noteLabel?.text = ""
        
        refreshUI()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    /*
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("reuseIdentifier", forIndexPath: indexPath) as UITableViewCell

        // Configure the cell...

        return cell
    }
    */

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
