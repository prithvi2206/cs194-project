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
    
    var jobId: PFObject?
    
    var contacts: [PFObject]? {
        didSet {
            if contacts?.count > 0 {
                tableView.reloadData()
            }
        }
    }
    
    private func removed_duplicates(contacts: [PFObject]) -> [PFObject] {
        var dictionary = [String: PFObject]()
        var result = [PFObject]()
        
        for(var i=0; i<contacts.count; i++) {
            if let name = contacts[i].objectForKey("name") as? String {
                if (dictionary[name] == nil) {
                    dictionary[name] = contacts[i]
                    result.append(contacts[i])
                }
            }
        }
        return result
    }
    
    private func fetchContacts() {
        if (jobId != nil) {
            if let company = jobId!.objectForKey("company") as? String {
                self.title = "Contacts: " + company
            } else {
                self.title = "Contacts"
            }
            
            PFQuery(className: "Contact").whereKey("userId", equalTo: PFUser.currentUser()).whereKey("appId", equalTo: jobId!).orderByAscending("name").findObjectsInBackgroundWithBlock { [unowned self] (result, error) -> Void in
                if var contacts = result as? [PFObject] {
                    
                    contacts = self.removed_duplicates(contacts)
                    self.contacts = contacts
                }
            }
        } else {
            self.title = "Contacts"
            PFQuery(className: "Contact").whereKey("userId", equalTo: PFUser.currentUser()).orderByAscending("name").findObjectsInBackgroundWithBlock { (result, error) -> Void in
                if var contacts = result as? [PFObject] {
                    let unique_contacts = self.removed_duplicates(contacts)
                    println(unique_contacts.count)
                    self.contacts = unique_contacts
                }
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
    }
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        
        var importContactButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Add, target: self, action: "segueToNewContactForm")
        
        self.navigationItem.rightBarButtonItem = importContactButton
        
        fetchContacts()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //let inset = UIEdgeInsetsMake(20, 0, 0, 0)
        //tableView.contentInset = inset
        tableView.backgroundColor = UIColor.whiteColor()
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
