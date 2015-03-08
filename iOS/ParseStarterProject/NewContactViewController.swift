//
//  NewContactViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/8/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import AddressBook
import AddressBookUI

class NewContactViewController: UIViewController, ABPeoplePickerNavigationControllerDelegate {

    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var titleTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var phoneNumberTextField: UITextField!
    @IBOutlet weak var companyTextField: UITextField!
    @IBOutlet weak var notesTextFied: UITextField!
    @IBOutlet weak var notesTextField: UITextField!
    
    @IBAction func showContactPicker(sender: UIButton) {
        var picker = ABPeoplePickerNavigationController()
        picker.peoplePickerDelegate = self
        
        self.presentViewController(picker, animated: true) { () -> Void in
            println("sweet!")
        }
    }
    
    func peoplePickerNavigationController(peoplePicker: ABPeoplePickerNavigationController!, didSelectPerson person: ABRecord!) {
        if let name = ABRecordCopyValue(person, kABPersonFirstNameProperty).takeRetainedValue() as? String {
            println(name)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 6
    }
    
    // Row display. Implementers should *always* try to reuse cells by setting each cell's reuseIdentifier and querying for available reusable cells with dequeueReusableCellWithIdentifier:
    // Cell gets various attributes set automatically based on table (separators) and data source (accessory views, editing controls)
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Reuse Cell") as? UITableViewCell
            return cell!;
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
