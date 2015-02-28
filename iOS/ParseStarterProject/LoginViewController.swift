//
//  LoginViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 2/23/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class LoginViewController: UIViewController
{
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    private struct Identifier {
        static let SuccessfulLoginSegue = "Sucessful Login Segue"
    }
    
    @IBAction func login(sender: UIButton) {
        if !usernameTextField.text.isEmpty && !passwordTextField.text.isEmpty {
            let username = usernameTextField.text
            let password = passwordTextField.text
            
            var user = PFUser.logInWithUsername(username, password: password)
            if user != nil {
                performSegueWithIdentifier(Identifier.SuccessfulLoginSegue, sender: sender)
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    /*
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue {
        case Identifier.SuccessfulLoginSegue:
            if let destination = segue.destinationViewController as? ContactsTableViewController {
                destination.model =
            }
        }
    }
    */

}
