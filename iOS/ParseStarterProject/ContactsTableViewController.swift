//
//  ContactsTableViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 2/23/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse
import AddressBook
import AddressBookUI


class ContactsTableViewController: UITableViewController, ABPeoplePickerNavigationControllerDelegate {
    var contacts: [PFObject]? {
        didSet {
            if contacts?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func fetchContacts() {
        PFQuery(className: "Contact").whereKey("userId", equalTo: PFUser.currentUser()).orderByAscending("name").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let contacts = result as? [PFObject] {
                self.contacts = contacts
            }
        }
        
    }
    
    func segueToNewContactForm() {
        performSegueWithIdentifier("New Contact Segue", sender: self)
    }
    
    func showAddressBook() {
        var picker = ABPeoplePickerNavigationController()
        picker.peoplePickerDelegate = self
        
        self.presentViewController(picker, animated: true) { () -> Void in
            println("sweet!")
        }
        
        /*
        var error: Unmanaged<CFError>? = nil
        var addressBook: ABAddressBookRef? = ABAddressBookCreateWithOptions(nil, &error)?.takeRetainedValue()
        var emptyDictionary: CFDictionaryRef?
        
        if let addressBook: ABAddressBookRef = addressBook {
            ABAddressBookRequestAccessCompletionHandler(ABAddressBookRequestAccessWithCompletion(addressBook, { (access, error) -> Void in
                if (access) {
                    
                } else {
                    
                }
            }))
        }
        */
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let inset = UIEdgeInsetsMake(20, 0, 0, 0)
        tableView.contentInset = inset
        
        var importContactButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Add, target: self, action: "segueToNewContactForm")

        self.navigationItem.rightBarButtonItem = importContactButton
        
        fetchContacts()

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
        if contacts != nil {
            return contacts!.count
        } else {
            return 0
        }
    }

    private struct Identifier {
        static let ContactsTableCell = "Contacts Table Cell"
    }
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(Identifier.ContactsTableCell, forIndexPath: indexPath) as UITableViewCell
        
        if let name = contacts?[indexPath.row].objectForKey("name") as? String
        {
            cell.textLabel.text = name
        }
        
        if let company = contacts?[indexPath.row].objectForKey("company") as? String {
            cell.detailTextLabel?.text = company
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

    private struct Identifiers {
        static let ContactDetailSegue = "Contact Detail Segue"
    }
    
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.ContactDetailSegue:
            if let contactDetailViewController = segue.destinationViewController as? ContactDetailTableViewController {
                if let contactCell = sender as? UITableViewCell {
                    if let indexPath = tableView.indexPathForCell(contactCell) {
                        contactDetailViewController.data = contacts?[indexPath.row]
                    }
                }
            }
        default:
            break
        }
        
        
        
    }
    

}
