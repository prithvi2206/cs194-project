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
    @IBOutlet weak var loginPanelView: UIView!
    @IBOutlet weak var loginButton: UIButton!
    
    
    
    
    
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
        
        self.loginPanelView.layer.borderColor = UIColor.lightGrayColor().CGColor
        self.loginPanelView.layer.borderWidth = 1.0
        self.loginPanelView.layer.cornerRadius = 2.0
        
        self.loginButton.layer.cornerRadius = 2.0
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
